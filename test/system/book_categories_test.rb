require "application_system_test_case"

class BookCategoriesTest < ApplicationSystemTestCase
  setup do
    @book_category = book_categories(:one)
  end

  test "visiting the index" do
    visit book_categories_url
    assert_selector "h1", text: "Book categories"
  end

  test "should create book category" do
    visit book_categories_url
    click_on "New book category"

    fill_in "Name", with: @book_category.name
    click_on "Create Book category"

    assert_text "Book category was successfully created"
    click_on "Back"
  end

  test "should update Book category" do
    visit book_category_url(@book_category)
    click_on "Edit this book category", match: :first

    fill_in "Name", with: @book_category.name
    click_on "Update Book category"

    assert_text "Book category was successfully updated"
    click_on "Back"
  end

  test "should destroy Book category" do
    visit book_category_url(@book_category)
    click_on "Destroy this book category", match: :first

    assert_text "Book category was successfully destroyed"
  end
end
