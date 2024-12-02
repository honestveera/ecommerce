class HomeController < ApplicationController
  skip_before_action :authenticate_user_from_token!

  def index
    respond_to do |format|
      format.html { render :index }

      format.png do
        filename = "#{File.basename(params[:path])}.png"
        blob = ActiveStorage::Blob.find_by(filename: filename)

        if blob
          send_data blob.download, filename: blob.filename.to_s, type: blob.content_type, disposition: 'inline'
        else
          render plain: 'File not found', status: :not_found
        end

        image_name = params[:path].sub('admin/public/uploads/', '')

        file_path_home = Rails.root.join("/#{image_name}.png")

        # Check in the "public/uploads/" folder
        file_path_admin = Rails.root.join('public', 'uploads', "#{image_name}.png")

        if File.exist?(file_path_home)
          send_file file_path_home, type: 'image/png', disposition: 'inline'
        elsif File.exist?(file_path_admin)
          send_file file_path_admin, type: 'image/png', disposition: 'inline'
        else
          render plain: 'Image not found', status: :not_found
       end
      end

      format.jpeg do
        filename = "#{File.basename(params[:path])}.jpeg"
        blob = ActiveStorage::Blob.find_by(filename: filename)

        if blob
          send_data blob.download, filename: blob.filename.to_s, type: blob.content_type, disposition: 'inline'
        else
          render plain: 'File not found', status: :not_found
        end
      end
    end
  end

  def all
    @users = User.all
    @corporates = Corporate.all
    @books = Book.all
    @enquiries = Enquiry.all
    render json: { users: @users, corporates: @corporates, books: @books, enquiries: @enquiries }
  end
end
