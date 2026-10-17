import axios from "axios";

const API_URL = "/api/purchase/";

const makePurchase = async () => {
  let response;
  response = await axios.post(API_URL, { test: "test" });

  return response.data;
};

const purchaseService = {
  makePurchase,
};

export default purchaseService;
