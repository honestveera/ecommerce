Rails.application.routes.draw do

  devise_for :users, path: '', path_names: {
    sign_in: 'api/v1/login',
    sign_out: 'api/v1/logout',
    registration: 'api/v1/signup'
  },
  controllers: {
    sessions: 'api/v1/sessions',
    registrations: 'api/v1/registrations'
  }

  devise_scope :user do
    namespace :api do
      namespace :v1 do
        post 'forgot_password', to: 'passwords#create'
        put 'password/edit', to: 'passwords#update'
      end
    end
  end

  namespace :api do
    namespace :v1 do
      get 'current_user', to: 'current_user#index'
      resources :categories do
        resources :books, only: [:index], controller: 'category_books'
        post 'upload', on: :collection
      end
      resources :books do
        resources :reviews, only: [:index, :create, :update, :destroy]
        post 'upload', on: :collection
      end

      resources :publishers
      resources :authors do 
        post 'upload', on: :collection
      end
      resources :subcategories
      resources :corporates
      resources :enquiries
      resources :terms_and_conditions do
        member do
          get 'list'
        end
      end

      resources :privacy_policies do
        member do
          get 'list'
        end
      end

      post 'forgot_password', to: 'passwords#create'
      resources :orders do
        member do
          put 'update_status'
        end
      end
      resources :delivery_partners
      resources :users, except: [:create] do
        member do
          put 'company_approval', to: 'users#update_company_approval'
        end
        delete 'carts/destroy_book/:book_id', to: 'carts#destroy_book', on: :member, as: 'destroy_book'
        resources :carts 
        resources :wish_lists
      end
      resources :users, except: [:create]
      resources :import_books 

      post 'upload_zip_file', to: 'import_books#upload_zip_file'
      post 'process_uploaded_zip_file', to: 'import_books#process_uploaded_zip_file'
      get 'home/index'

      # OTP Validation
      post '/send_otp', to: 'otp#send_otp'
      post '/validate_otp', to: 'otp#validate_otp'
    end
  
    namespace :v2 do
      resources :categories
      resources :books
      resources :publishers
      resources :authors
      resources :subcategories
      resources :corporates
      resources :enquiries
    end
  end

  root 'home#index'
  # get '/home', to: 'home#index', format: 'jpeg'
  # Define your application routes per the DSL in https://guides.rubyonrails.org/routing.html

  # Defines the root path route ("/")
  # root "articles#index"
  get '*path', to: 'home#index', via: :all 
  # config/routes.rb
end
