import CategoryList from "./Category";
import ProductList from "./ProductsList";
import Slider from "./Slider";
import Banner from "./Banner";
import WhyUs from "./WhyUS";
import SearchbarSmall from "./SearchbarSmall";

function index() {
  return (
    <>
      <SearchbarSmall />
      <Slider />
      <CategoryList />
      <ProductList />
      <Banner />
      <WhyUs />
    </>
  );
}

export default index;
