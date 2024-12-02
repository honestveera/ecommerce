class  Api::V1::BookCategoriesController < ApplicationController
  before_action :set_book_category, only: %i[ show edit update destroy ]

  # GET /book_categories
  def index
    @book_categories = BookCategory.all
  end

  # GET /book_categories/1
  def show
  end

  # GET /book_categories/new
  def new
    @book_category = BookCategory.new
  end

  # GET /book_categories/1/edit
  def edit
  end

  # POST /book_categories
  def create
    @book_category = BookCategory.new(book_category_params)

    if @book_category.save
      redirect_to @book_category, notice: "Book category was successfully created."
    else
      render :new, status: :unprocessable_entity
    end
  end

  # PATCH/PUT /book_categories/1
  def update
    if @book_category.update(book_category_params)
      redirect_to @book_category, notice: "Book category was successfully updated.", status: :see_other
    else
      render :edit, status: :unprocessable_entity
    end
  end

  # DELETE /book_categories/1
  def destroy
    @book_category.destroy
    redirect_to book_categories_url, notice: "Book category was successfully destroyed.", status: :see_other
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_book_category
      @book_category = BookCategory.find(params[:id])
    end

    # Only allow a list of trusted parameters through.
    def book_category_params
      params.require(:book_category).permit(:name)
    end
end
