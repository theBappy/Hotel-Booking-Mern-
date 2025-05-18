import express from 'express'
import { protect } from '../middlewares/auth.middleware.js'
import { getUserData, storeRecentSearchedCities } from '../controllers/user. controller.js'

const userRouter = express.Router()

userRouter.get('/', protect, getUserData)
userRouter.post('/store-recent-search', protect, storeRecentSearchedCities)

export default userRouter