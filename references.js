router.post('/signup', (req, res) => {
    bcryptjs.hash(req.body.password, 10, (error, hash) => {
        if (error) {
            console.log(error);
            return res.status(500).json({
                error: error
            });
        } else {
            const user = new User({
                _id: new mongoose.Types.ObjectId(),
                username: req.body.username,
                password: hash,
                type: req.body.type
            })
            user.save().then(result => {
                console.log(result);
                res.status(200).json({
                    message: 'User created'
                })
            })
            .catch(error => {
                console.log(error);
                res.status(500).json({ error: error })
            })

        }
    })
});