class ApiFeatures{
    constructor(mongooseQuery, queryString){
        this.mongooseQuery = mongooseQuery;
        this.queryString = queryString;
    }
    filter(){
        
    //take a copy of the req.query to apply the filter on without affecting the original req.query
    const queryStringObj = {...this.queryString};
    const excludesFields = ['page', 'sort','limit','fields'];
    excludesFields.forEach((field) => delete queryStringObj[field]);
    //we need to convert the object to string to use RegEx for gte, gt, lte, lt
    let queryStr = JSON.stringify(queryStringObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match)=> `$${match}`); 
    // we de  \b before and after the string to make it needed to have space before and after 
    // and don’t get strings that these gte, gt.. are a part of its words 
    // and we use \g to get all the strings this conditions applied on not the first one only

    //parse the string into JSON to return it
    this.mongooseQuery = this.mongooseQuery.find(JSON.parse(queryStr));

    return this;
    }

    sort(){
        if(this.queryString.sort){ //ascending by default
            const sortBy = this.queryString.sort.split(',').joint(' ');
            this.mongooseQuery = this.mongooseQuery.sort(sortBy);
        }else{
            this.mongooseQuery = this.mongooseQuery.sort('-CreateAt');
        }

        return this;
    }

    limitFields(){
        if(this.queryString.fields){
            const fields = this.queryString.fields.split(',').join(' ');
            this.mongooseQuery = this.mongooseQuery.select(fields);
        }else{
            this.mongooseQuery = this.mongooseQuery.select('-v');
        }

        return this;
    }

    search(modelName){
        if(this.queryString.keyword){
            const query = {};
            if(modelName === 'Products'){
                query.$or = [
                    {title: {$regex: this.queryString.keyword, $options: 'i'}}
                    ,{description: {$regex: this.queryString.keyword, $options: 'i'}}
                ]
            }else {
                query = { name: { $regex: this.queryString.keyword, $options: 'i' } };
            }
            this.mongooseQuery = this.mongooseQuery.find(query);
        }
        return this;
    }
    paginate(countDocuments){
        const page = this.queryString.page * 1 || 1;
        const limit = this.queryString.limit * 1 || 10;
        const skip = (page - 1) * limit;
        const endIndex = page * limit;

        const pagination = {};
        pagination.currentPage = page;
        pagination.limit = limit;
        pagination.numberOfPages = Math.ceil(countDocuments / limit);

        //next page
        if(endIndex < countDocuments){
            pagination.next = page + 1;
        }

        //prev page
        if(skip > 0){
            pagination.prev = page - 1;
        }

        this.mongooseQuery = this.mongooseQuery.skip(skip).limit(limit);

        this.paginationResult = pagination;

        return this;
    }
}

module.exports = ApiFeatures;