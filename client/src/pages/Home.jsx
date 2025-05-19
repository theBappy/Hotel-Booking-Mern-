import Hero from '../components/Hero'
import FeaturedDestination from '../components/FeaturedDestination'
import ExclusiveOffer from '../components/ExclusiveOffer'
import Testimonials from '../components/Testimonials'
import Newsletter from '../components/Newsletter'
import RecommendedHotels from '../components/RecommendedHotel'


const Home = () => {
  return (
    <>
        <Hero />
        <RecommendedHotels />
        <FeaturedDestination />
        <ExclusiveOffer />
        <Testimonials />
        <Newsletter />

    </>
  )
}

export default Home