require "application_system_test_case"

class CorporatesTest < ApplicationSystemTestCase
  setup do
    @corporate = corporates(:one)
  end

  test "visiting the index" do
    visit corporates_url
    assert_selector "h1", text: "Corporates"
  end

  test "should create corporate" do
    visit corporates_url
    click_on "New corporate"

    check "Active" if @corporate.active
    fill_in "Name", with: @corporate.name
    fill_in "Subscription date", with: @corporate.subscription_date
    fill_in "Validity", with: @corporate.validity
    click_on "Create Corporate"

    assert_text "Corporate was successfully created"
    click_on "Back"
  end

  test "should update Corporate" do
    visit corporate_url(@corporate)
    click_on "Edit this corporate", match: :first

    check "Active" if @corporate.active
    fill_in "Name", with: @corporate.name
    fill_in "Subscription date", with: @corporate.subscription_date
    fill_in "Validity", with: @corporate.validity
    click_on "Update Corporate"

    assert_text "Corporate was successfully updated"
    click_on "Back"
  end

  test "should destroy Corporate" do
    visit corporate_url(@corporate)
    click_on "Destroy this corporate", match: :first

    assert_text "Corporate was successfully destroyed"
  end
end
