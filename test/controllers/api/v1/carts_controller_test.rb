require "test_helper"

class Api::V1::CartsControllerTest < ActionDispatch::IntegrationTest
  test "should get show" do
    get api_v1_carts_show_url
    assert_response :success
  end

  test "should get add_to_cart" do
    get api_v1_carts_add_to_cart_url
    assert_response :success
  end
end
