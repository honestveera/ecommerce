require "test_helper"

class BookCategoriesControllerTest < ActionDispatch::IntegrationTest
  setup do
    @book_category = book_categories(:one)
  end

  test "should get index" do
    get book_categories_url
    assert_response :success
  end

  test "should get new" do
    get new_book_category_url
    assert_response :success
  end

  test "should create book_category" do
    assert_difference("BookCategory.count") do
      post book_categories_url, params: { book_category: { name: @book_category.name } }
    end

    assert_redirected_to book_category_url(BookCategory.last)
  end

  test "should show book_category" do
    get book_category_url(@book_category)
    assert_response :success
  end

  test "should get edit" do
    get edit_book_category_url(@book_category)
    assert_response :success
  end

  test "should update book_category" do
    patch book_category_url(@book_category), params: { book_category: { name: @book_category.name } }
    assert_redirected_to book_category_url(@book_category)
  end

  test "should destroy book_category" do
    assert_difference("BookCategory.count", -1) do
      delete book_category_url(@book_category)
    end

    assert_redirected_to book_categories_url
  end
end
