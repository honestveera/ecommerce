class Api::V1::CategoryBooksController < ApplicationController
  before_action :set_category

  def index
    @books = @category.books
    render json: @books, status: :ok
  end

  private

  def set_category
    @category = Category.find(params[:category_id])
  end
end
