"use strict";

import NewsDao from "../dao/newsDAO.mjs";


const newsController = {
    findAllNews: async () => {
        return await NewsDao.findAllNews();
    },
  
 
}

export default newsController