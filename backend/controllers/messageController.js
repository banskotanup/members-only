const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

exports.createMessage = async (req, res) => {
    const { title, text } = req.body;
    try {
        const message = await prisma.message.create({
            data: {
                title, text, authorId: req.user.id
            },
        });
        return res.status(201).json(message);
    }
    catch (err) {
        return res.status(400).json({ error: err.message });
    }
};

exports.getMessages = async (req, res) => {
    const messages = await prisma.message.findMany({
        include: { author: true },
        orderBy: { timestamp: "desc" },
    });

    //hide author for non-members
    const filteredMessage = messages.map((msg) => {
        if (!req.user || !req.user.membershipStatus) {
            const { authorId, ...rest } = msg; // remove foreign key
            return {
                ...rest,
                author: { firstName: "Anonymous", lastName: "" }
            };
        }
        return msg;
    });
    return res.json(filteredMessage);
}

exports.deleteMessage = async (req, res) => {
    const { id } = req.params;
    try {
        await prisma.message.delete({
            where: { id: parseInt(id) }
        });
        return res.json({ message: "Message deleted" });
    }
    catch (err) {
        return res.status(400).json({ error: err.message });
    }
};