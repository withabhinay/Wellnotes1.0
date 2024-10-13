import Routes from 'express';
const User = Routes.Router();
export default User;
import { Users } from "../Models.js";


// Server is running
User.get("/", (req, res) => {
    res.status(200).json({
        Status: "Success",
        Message: "User route is working",
    });
});

// Create a new Journal
User.post("/new_journal", async (req, res) => {
    function main() {
        // console.log(req);
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
                    res.status(201).json({
                        Status: "Success",
                        Message: "Journal added successfully",
                        Journal: Journal,
                    });
                }else{
                    res.status(200).json({
                        Status: "Error",
                        Message: "Description must be at least 3 characters and maximum of 1000 characters",
                    });
                }
            }else{
                return res.status(400).json({
                    Status: "Error",
                    Message: "Title must be at least 3 characters and maximum of 100 characters",
                });
            }
        }else{
            return res.status(400).json({
                Status: "Error",
                Message: "Title and Description are required",
            });
        }
    }
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
        const ID = "";
        await Users.findOne({ID: ID}, (err, data) => {
            if (err) {
                return res.status(500).json({
                    Status: "Error",
                    Message: "Internal server error",
                });
            }
            return res.status(200).json({
                Status: "Success",
                Journals: data.Journals,
            });
        
        });
    }
    main().catch(e=>{
        res.status(500).json({
            Status: "Error",
            Message: "Internal server error",
        });
    })
});

// If route is not found
User.get("*", (req, res) => {
    res.status(404).json({
        Status: "Error",
        Message: "Route not found",
    });
});
