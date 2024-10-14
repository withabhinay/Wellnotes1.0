import Routes from 'express';
import jwt from 'jsonwebtoken';
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
};

function Create_JWT_Token(payload){
    const opt = {
        issuer: 'WellNotes',
        expiresIn: '30d',
    };
    try{
        const Token = jwt.sign({payload}, process.env.JWT_SECRET, opt);
        return Token;
    }catch{
        return null;
    };
};
function Verify_JWT_Token(Token){
    const opt = {
        issuer: 'WellNotes',
        expiresIn: '30d',
    };
    try{
        const decoded = jwt.verify(Token, process.env.JWT_SECRET, opt);
        return decoded;
    }catch{
        return null;
    };
};
function Create_Authentication_Token(){
    let characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789.,!@#$%^&*()_+{}|:"<>?';
    let Token = '';
    for (let i = 0; i < 20; i++) {
        Token += characters.charAt(Math.floor(Math.random() * characters.length));
    };
    return Token;
};

const ValidToken = async Token =>{
    try{
        if(Token){
            let a = Verify_JWT_Token(Token);
            // console.log(a);
            a = a.payload;
            if(a){
                let GetUser = await Users.findOne({_id: a.ID});
                if(GetUser){
                    if(GetUser.Authentication.Token == a.Token){
                        return GetUser;
                    }else{
                        return null;
                    };
                }
            }else{
                return null;
            };
        };
        return null;
    }catch{
        return null;
    }
};
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
        let {Email} = req.body;
        if (Email) {
            Email = Email.toLowerCase();
            if(isValidEmail(Email)){
                let data = await Users.findOne({Email: Email});
                // If User exists
                if (data) {
                    const Token = Create_Authentication_Token();
                    const Auth = Create_JWT_Token({
                        Token: Token,
                        ID: data._id,                    
                    });
                    await Users.updateOne({Email: Email}, {$set: {
                        "Authentication.Token": Token,
                        "Authentication.Date": new Date()
                    }}).then(()=>{
                        return res.status(200).json({
                            Status: "Success",
                            Token: Auth,
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
                        
                        const Token = Create_Authentication_Token();
                        const Auth = Create_JWT_Token({
                            Token: Token,
                            ID: ID,
                        });
                        return res.status(200).json({
                            Status: "Success",
                            Token: Auth,
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
                Message: "Email Required",
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
    async function main(CheckedUser) {
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
                    await Users.updateOne({Email: CheckedUser.Email}, {
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
    const a = await ValidToken(req.body.Token);
    if(a){
        main(a).catch(()=>{
            return res.status(500).json({
                Status: "Error",
                Message: "Internal server error",
            });
        });
    }else{
        return res.status(403).json({
            Status: "Error",
            Message: "Unauthorized access, please login and try again later.",
        });

    }
});

// Get all Journal 
User.get("/all_journals", async (req, res) => {
    async function main(CheckedUser){
                
        return res.status(200).json({
            Status: "Success",
            Journals: CheckedUser.Journals,
        });
    };
    const a = await ValidToken(req.body.Token);
    if(a){
        main(a).catch(()=>{
            return res.status(500).json({
                Status: "Error",
                Message: "Internal server error",
            });
        });
    }else{
        return res.status(403).json({
            Status: "Error",
            Message: "Unauthorized access, please login and try again later.",
        });

    }
});
// Get a Journal by ID
User.get("/journals/:id", async (req, res) => {
    async function main(CheckedUser){
        const id = req.params.id;
        let Journals = CheckedUser.Journals;
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
    };
    const a = await ValidToken(req.body.Token);
    if(a){
        main(a).catch(()=>{
            return res.status(500).json({
                Status: "Error",
                Message: "Internal server error",
            });
        });
    }else{
        return res.status(403).json({
            Status: "Error",
            Message: "Unauthorized access, please login and try again later.",
        });

    }
});
// Search for a Journal
User.get("/journals/search", async (req, res) => {
    async function main(CheckedUser){
        function findMatchingObjects(sentence, objectsArray) {
            function isPercentageSame(s1, s2, percentage) {
                const lengthToCompare = Math.floor(s2.length * (percentage / 100));
                return s1.substring(0, lengthToCompare) === s2.substring(0, lengthToCompare);
            };
            const matchedObjects = objectsArray.filter(obj => isPercentageSame(sentence, obj.Title, 40));
            return matchedObjects.length > 0 ? matchedObjects : null;
        };
        const Title = req.body.Title;
        
        let Journals = CheckedUser.Journals;
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

    };
    const a = await ValidToken(req.body.Token);
    if(a){
        main(a).catch(()=>{
            return res.status(500).json({
                Status: "Error",
                Message: "Internal server error",
            });
        });
    }else{
        return res.status(403).json({
            Status: "Error",
            Message: "Unauthorized access, please login and try again later.",
        });

    }
});
// Get profile
User.get("/profile", async (req, res) => {
    async function main(CheckedUser){
        return res.status(200).json({
            Status: "Success",
            Journals: CheckedUser,
        });
    };
    const a = await ValidToken(req.body.Token);
    if(a){
        main(a).catch(()=>{
            return res.status(500).json({
                Status: "Error",
                Message: "Internal server error",
            });
        });
    }else{
        return res.status(403).json({
            Status: "Error",
            Message: "Unauthorized access, please login and try again later.",
        });

    }
});

User.get("/logout", async (req, res) => {
    async function main(CheckedUser){

        await Users.updateOne({Email: CheckedUser.Email}, {
            $set: {
                "Authentication.Token": "",
                "Authentication.Date": new Date()
            }
        }).then(()=>{
            return res.status(200).json({
                Status: "Success",
                Message: "User logged out",
            });
        }).catch(()=>{
            return res.status(500).json({
                Status: "Error",
                Message: "Internal server error",
            });
        });
    };
    const a = await ValidToken(req.body.Token);
    if(a){
        main(a).catch(()=>{
            return res.status(500).json({
                Status: "Error",
                Message: "Internal server error",
            });
        });
    }else{
        return res.status(403).json({
            Status: "Error",
            Message: "Unauthorized access, please login and try again later.",
        });
    };
});

// If route is not found
User.get("*", (req, res) => {
    res.status(404).json({
        Status: "Error",
        Message: "Route not found",
    });
});
