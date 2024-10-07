import express from 'express';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc.js';
import { v4 as uuidv4 } from 'uuid';
import { validateTodo, validateUser } from '../schemas/validators.js';
import auth from '../middleware/auth.js';
import { verifyToken } from '../functions/cookies.js';


dayjs.extend(utc);
const router = express.Router();

export default ({todoRepository}) => {
    // Create new todo
    router.post('/', auth, async (req, res) => {
        try {
            let session = verifyToken(req.cookies['todox-session']);

            const todoID = uuidv4();
            const created = dayjs().utc().toISOString();

            let newTodo = {
                ...req.body,
                todoID,
                userID: session.userID,
                completed: false, // Adding default value for new todos completion status
                created
            };

            if (validateTodo(newTodo)) {
                let resultTodo = await todoRepository.insertOne(newTodo);
                return res.status(201).send(resultTodo);
            }
            console.error(validateTodo.errors);
            return res.status(400).send({error: "Invalid field used."});
        }
        catch (err) {
            console.error(err);
            return res.status(500).send({error: "Todo creation failed."});
        }
    });

    // Get all todos from user ID
    router.get('/', auth, async (req, res) => {
        try {
            // Verifying and decoding token to get userID
            let session = verifyToken(req.cookies['todox-session']);

            // Using newly created repository function to only find todos for currently signed in user
            let todos = await todoRepository.findAll(session.userID);
            return res.status(200).send(todos);
        }
        catch (err) {
            console.error(err);
            return res.status(500).send({error: "Failed to fetch todos."});
        }
    });

    // Update the completion status of a todo
    router.patch('/:todoID', auth, async (req, res) => {
        try {
            let session = verifyToken(req.cookies['todox-session']);
            const { todoID } = req.params; // Getting todoID from the URL
            const { completed } = req.body; // Getting the new completed value from the request body

            // Validate that the completed field is a boolean (just in case, for future-proofing)
            if (typeof completed !== 'boolean') {
                return res.status(400).send({ error: "Invalid 'completed' value. It must be a boolean." });
            }

            // Update the completion status using the repository function
            const result = await todoRepository.updateCompletionStatus(todoID, completed);
            
            // Check if the update was performed
            if (result.modifiedCount > 0) {
                return res.status(200).send({ message: "Todo updated successfully." });
            } else {
                return res.status(404).send({ error: "Todo not found." });
            }
        } catch (err) {
            console.error(err);
            return res.status(500).send({ error: "Failed to update todo." });
        }
    });

    return router;
}
