require "test_helper"

class CorporatesControllerTest < ActionDispatch::IntegrationTest
  setup do
    @corporate = corporates(:one)
  end

  test "should get index" do
    get corporates_url
    assert_response :success
  end

  test "should get new" do
    get new_corporate_url
    assert_response :success
  end

  test "should create corporate" do
    assert_difference("Corporate.count") do
      post corporates_url, params: { corporate: { active: @corporate.active, name: @corporate.name, subscription_date: @corporate.subscription_date, validity: @corporate.validity } }
    end

    assert_redirected_to corporate_url(Corporate.last)
  end

  test "should show corporate" do
    get corporate_url(@corporate)
    assert_response :success
  end

  test "should get edit" do
    get edit_corporate_url(@corporate)
    assert_response :success
  end

  test "should update corporate" do
    patch corporate_url(@corporate), params: { corporate: { active: @corporate.active, name: @corporate.name, subscription_date: @corporate.subscription_date, validity: @corporate.validity } }
    assert_redirected_to corporate_url(@corporate)
  end

  test "should destroy corporate" do
    assert_difference("Corporate.count", -1) do
      delete corporate_url(@corporate)
    end

    assert_redirected_to corporates_url
  end
end
