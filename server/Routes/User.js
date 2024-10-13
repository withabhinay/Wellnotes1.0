import Routes from 'express';
const User = Routes.Router();
export default User;
import { Users } from "../Models.js";

function isValidEmail(mail) {
    const a = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return a.test(mail);
};
function Profile_ID() {
    const length = 13;
    let randomID = '';
    while (randomID.length < length) {
        randomID += Math.random().toString().slice(2);
    }
    return randomID.slice(0, length);
}

// Server is running
User.get("/", (req, res) => {
    res.status(200).json({
        Status: "Success",
        Message: "User route is working",
    });
});

// Authenticate user
User.post("/auth", async (req, res) => {
    async function main() {
        let {Name, Email, Token} = req.body;
        if (Name && Email && Token) {
            Email = Email.toLowerCase();
            if(isValidEmail(Email)){
                let data = await Users.findOne({Email: Email});
                // If User exists
                if (data) {
                    await Users.updateOne({Email: Email}, {$set: {
                        "Authentication.Token": Token,
                        "Authentication.Date": new Date()
                    }}).then(()=>{
                        return res.status(200).json({
                            Status: "Success",
                            Message: "User authenticated",
                        });
                    }).catch(()=>{
                        return res.status(500).json({
                            Status: "Error",
                            Message: "Internal server error",
                        });
                    });
                }else{  
                    // If user does not exist
                    let ID = "";
                    while (true){
                        ID = Profile_ID();
                        const check = await Users.findOne({_id: ID});
                        if (!check) {
                            break;
                        };
                    };
                    const New_User = new Users({
                        _id: ID,
                        Name: Name,
                        Email: Email,
                        Authentication:{
                            Token: Token,
                            Date: new Date(),
                        },
                        Journals: [],
                        Tokens_Earned: 0,
                        createdAt: new Date(),
                    });
                    await New_User.save().then(()=>{
                        return res.status(201).json({
                            Status: "Success",
                            Message: "User created",
                        });
                    }).catch(e=>{
                        return res.status(500).json({
                            Status: "Error",
                            Message: "Internal server error",
                        });
                    });
                };
            }else{
                return res.status(400).json({
                    Status: "Error",
                    Message: "Invalid email",
                });
            };
        }else{
            return res.status(400).json({
                Status: "Error",
                Message: "Email and Password are required",
            });
        };
    };
    main().catch(()=> {
        return res.status(500).json({
            Status: "Error",
            Message: "Internal server error",
        });
    });
});
// Create a new Journal
User.post("/new_journal", async (req, res) => {
    async function main() {
        const {Title, Description} = req.body;
        if (Title && Description) {
            if (Title.length > 3 && Title.length < 100) {
                if (Description.length > 3 && Description.length < 1000) {
                    const newDate = new Date();
                    const ID = Date.now();
                    const Journal = {
                        ID: ID,
                        Title: Title,
                        Description: Description,
                        Date: newDate,
                    };
                    let Email = req.body.Email;
                    let GetUser = await Users.findOne({Email: Email});
                    if (GetUser) {
                        await Users.updateOne({Email: GetUser.Email}, {
                            $push: {
                                Journals: Journal
                            },
                            $set: {
                                Tokens_Earned: GetUser.Tokens_Earned+1
                            }
                        }).then(()=>{
                            return res.status(201).json({
                                Status: "Success",
                                Message: "Journal added successfully",
                                Journal: Journal,
                            });
                        }).catch(e=>{
                            return res.status(500).json({
                                Status: "Error",
                                Message: "Internal server error",
                            });
                        });
                    }else{
                        return res.status(404).json({
                            Status: "Error",
                            Message: "User not found",
                        });
                    };
                }else{
                    return res.status(200).json({
                        Status: "Error",
                        Message: "Description must be at least 3 characters and maximum of 1000 characters",
                    });
                };
            }else{
                return res.status(400).json({
                    Status: "Error",
                    Message: "Title must be at least 3 characters and maximum of 100 characters",
                });
            };
        }else{
            return res.status(400).json({
                Status: "Error",
                Message: "Title and Description are required",
            });
        };
    };
    main().catch(()=>{
        return res.status(500).json({
            Status: "Error",
            Message: "Internal server error",
        });
    });
});

// Get all Journal 
User.get("/all_journals", async (req, res) => {
    async function main(){
        const Email = req.body.Email;
        await Users.findOne({Email: Email}, (err, data) => {
            if (err) {
                return res.status(500).json({
                    Status: "Error",
                    Message: "Internal server error",
                });
            };
            if(data){
                
                return res.status(200).json({
                    Status: "Success",
                    Journals: data.Journals,
                });
            }else{
                return res.status(404).json({
                    Status: "Error",
                    Message: "User not found",
                });
            };
        });
    };
    main().catch(e=>{
        res.status(500).json({
            Status: "Error",
            Message: "Internal server error",
        });
    });
});
// Get a Journal by ID
User.get("/journals/:id", async (req, res) => {
    async function main(){
        const Email = req.body.Email;
        const id = req.params.id;
        await Users.findOne({Email: Email}, (err, data) => {
            if (err) {
                return res.status(500).json({
                    Status: "Error",
                    Message: "Internal server error",
                });
            };
            if (data) {
                let Journals = data.Journals;
                for (let i = 0; i < Journals.length; i++) {
                    const element = Journals[i];
                    if (element.ID == id) {
                        return res.status(200).json({
                            Status: "Success",
                            Journal: element,
                        });
                    };
                };
                return res.status(404).json({
                    Status: "Error",
                    Message: "Journal not found",
                });
            }else{
                return res.status(404).json({
                    Status: "Error",
                    Message: "User not found",
                });
            };
        });
    };
    main().catch(e=>{
        res.status(500).json({
            Status: "Error",
            Message: "Internal server error",
        });
    });
});
// Search for a Journal
User.get("/journals/search", async (req, res) => {
    async function main(){
        function findMatchingObjects(sentence, objectsArray) {
            function isPercentageSame(s1, s2, percentage) {
                const lengthToCompare = Math.floor(s2.length * (percentage / 100));
                return s1.substring(0, lengthToCompare) === s2.substring(0, lengthToCompare);
            };
            const matchedObjects = objectsArray.filter(obj => isPercentageSame(sentence, obj.Title, 40));
            return matchedObjects.length > 0 ? matchedObjects : null;
        };
        const Email = req.body.Email;
        const Title = req.body.Title;
        await Users.findOne({Email: Email}, (err, data) => {
            if (err) {
                return res.status(500).json({
                    Status: "Error",
                    Message: "Internal server error",
                });
            };
            if(data){
                let Journals = data.Journals;
                for (let i = 0; i < Journals.length; i++) {
                    const element = Journals[i];
                    if (Journals.Title.toLowerCase().trim() == Title.toLowerCase()) {
                        return res.status(200).json({
                            Status: "Success",
                            Matched: "100%",
                            Journal: element,
                        });
                    };
                };
                const Found = findMatchingObjects(Title, Journals);
                if (Found) {
                    return res.status(200).json({
                        Status: "Success",
                        Matched: "40%",
                        Journals: Found,
                    });
                };
                return res.status(404).json({
                    Status: "Error",
                    Message: "Journal not found",
                });
            }else{
                return res.status(404).json({
                    Status: "Error",
                    Message: "User not found",
                });
            };
        });
    };
    main().catch(e=>{
        res.status(500).json({
            Status: "Error",
            Message: "Internal server error",
        });
    });
});
// Get profile
User.get("/profile", async (req, res) => {
    async function main(){
        const Email = req.body.Email;
        await Users.findOne({Email: Email}, (err, data) => {
            if (err) {
                return res.status(500).json({
                    Status: "Error",
                    Message: "Internal server error",
                });
            };
            return res.status(200).json({
                Status: "Success",
                Journals: data,
            });
        });
    };
    main().catch(e=>{
        res.status(500).json({
            Status: "Error",
            Message: "Internal server error",
        });
    });
});

// If route is not found
User.get("*", (req, res) => {
    res.status(404).json({
        Status: "Error",
        Message: "Route not found",
    });
});
