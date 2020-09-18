const { updateClassName } = require('./controller');

const json = jest.fn();
const send = jest.fn();
const req = {
    body: {
        className: 'Énglish'
    },
};

const res = {
    status: (statusCode) => ({
        json,
        send
    }),
    send
};

test('should be defined', () => {
    expect(updateClassName).toBeDefined()
});

test('Change ClassName', () => {
    updateClassName(req, res);
    expect(json).toHaveBeenCalled();
});