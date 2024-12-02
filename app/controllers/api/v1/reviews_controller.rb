class Api::V1::ReviewsController < ApplicationController
  before_action :authenticate_user!
  skip_before_action :verify_authenticity_token

  include PaginationHelper
  before_action :set_book

  def index
    @reviews = @book.reviews
    pagination_info = paginate_records(@reviews)
    render_pagination(pagination_info, Api::V1::ReviewSerializer, code: 200, message: 'Reviews Fetched Successfully')
  end

  def create
    @review = @book.reviews.build(review_params)
    if @review.save
    # Calculate and update overall rating for the book
      @book.calculate_overall_rating

      render json: @review, status: :created
      else
        render json: { errors: @review.errors.full_messages }, status: :unprocessable_entity
      end
    end

  private

  def set_book
    @book = Book.find(params[:book_id])
  end

  def review_params
    params.require(:review).permit(:rating, :comment)
  end
end
