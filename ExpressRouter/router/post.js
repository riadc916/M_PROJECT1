const express=require("express");
const router=express.Router();

router.get("/",(req,res)=>{
    res.send("This is post router")
})

router.get("/:id",(req,res)=>{
    res.send("this is post id router")
})
router.post("/:id",()=>{
    res.send("this is post id for post router")
})
router.delete("/:id",(req,res)=>{
    res.send("this is post id for delete router")
})

module.exports=router;