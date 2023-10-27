class ApiFeatures{                 // keyword ah ==>req engura object la vangurathu thaan querystr 
    constructor (query , queryStr){//PC -> line: 9 kulla await use panni call pannum pothu athu oru object ah return pannum atha thaan query engura name la call pannum
    this.query= query;
    this.queryStr = queryStr;
    }
    // search pannura functionality 
    search(){   //keyword na query parameter
       let keyword =this.queryStr.keyword ? {
        name :{
            //mongodb oda query operator
            $regex: this.queryStr.keyword,
            $options: 'i' //case - in sensitive pannum
        }
       }:{};
        this.query.find({...keyword})
        return this;
    }
    //FILTER CATEGORY
    filter(){
        const queryStrCopy ={...this.queryStr}
        //before
        // console.log("Before:",queryStrCopy)

        //removing fields from query
        const removeFields = ['keyword','limit', 'pages']
        removeFields.forEach(field => delete queryStrCopy[field])

        //after
        // console.log("After:",queryStrCopy)

        let queryStr =JSON.stringify(queryStrCopy);
        queryStr = queryStr.replace(/\b(gt|gte|lt|lte)/g, match =>`$${match}`)

        // console.log("Prize:",queryStr)

        this.query.find(JSON.parse(queryStr));
        return this
    }
     // paginate functionality 

     paginate(resPerPage){
        const currentPage = Number(this.queryStr.pages) || 1; //string value ah erukum we convert into number value
        const skip = resPerPage * (currentPage - 1); //skip-> it helps to take data from currentpage
        this.query.limit(resPerPage).skip(skip);
        return this; //class oda object ah return pannurom
            
     }


}
module.exports = ApiFeatures