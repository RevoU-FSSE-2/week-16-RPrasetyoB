"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const schema_1 = require("../../../config/schemas/schema");
const taskController_1 = require("../../../controllers/taskController");
jest.mock('../../../config/schema');
describe('updateTask', () => {
    let req;
    let res;
    beforeEach(() => {
        req = {
            params: { id: '123' },
            body: { status: 'In progress' },
            role: 'manager'
        };
        res = {
            status: jest.fn(() => res),
            json: jest.fn()
        };
    });
    it('should update task status for manager role', async () => {
        const mockUpdateOne = jest.spyOn(schema_1.taskModel, 'updateOne').mockResolvedValue({ modifiedCount: 1 });
        await (0, taskController_1.updateTask)(req, res);
        expect(mockUpdateOne).toHaveBeenCalledWith({ _id: '123' }, { status: 'In progress' });
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
            success: true,
            message: 'Successfully updated status',
            data: { status: 'In progress' }
        });
    });
    afterEach(() => {
        jest.clearAllMocks();
    });
});
