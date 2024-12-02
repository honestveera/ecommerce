# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the bin/rails db:seed command (or created alongside the database with db:setup).
#
# Examples:
#
#   movies = Movie.create([{ name: "Star Wars" }, { name: "Lord of the Rings" }])
#   Character.create(name: "Luke", movie: movies.first)

# db/seeds.rb

# Create Corporate records
5.times do
  Corporate.create!(
    name: Faker::Company.name,
    subscription_date: Faker::Date.between(from: 2.years.ago, to: Date.today),
    validity: Faker::Date.between(from: Date.today, to: 2.years.from_now),
    address: Faker::Address.street_address,
    active: [true, false].sample
  )
end
# db/seeds.rb
# db/seeds.rb

  TermsAndCondition.create!(
    content: <<-CONTENT
      This is a sample terms and conditions content.
      Please replace this with your actual terms and conditions.

      1. Users must agree to abide by the rules and policies of the library.
      2. Late returns may incur fines, and damaged materials must be reported.
      3. Respect the privacy and security of other users.
      4. Digital resources are subject to copyright laws.

      Thank you for your cooperation!
    CONTENT
  )


PrivacyPolicy.create!(
  content: <<-CONTENT
    **Privacy Policy**

    This Privacy Policy describes how our library management system collects, uses, and shares your information when you use our services.

    **Information We Collect:**
    - User registration information (name, email, etc.).
    - Borrowing and return history.
    - Usage analytics to improve our services.

    **How We Use Your Information:**
    - To provide and personalize our services.
    - To communicate with you about your account.
    - To improve and optimize our services.

    **Information Sharing:**
    - We do not sell, trade, or otherwise transfer your personal information to outside parties.

    **Security:**
    - We take reasonable measures to protect your personal information from unauthorized access.

    **Your Choices:**
    - You can manage your account and privacy settings.
    - You can opt-out of certain communications.

    **Changes to This Privacy Policy:**
    - We may update our Privacy Policy from time to time.

    By using our library management system, you agree to the terms of this Privacy Policy.

    Thank you for using our services!
  CONTENT
)



# Create User records
10.times do
  user = User.create!(
    first_name: Faker::Name.name,
    last_name: Faker::Name.name,
    phone_number: Faker::PhoneNumber.phone_number,
    email: Faker::Internet.email,
    country: Faker::Address.country,
    gender: %w[Male Female Other].sample,
    age: Faker::Number.between(from: 18, to: 65),
    password: Faker::Internet.password,
    corporate: Corporate.all.sample,
  )
end

# Create Role records
%w[Admin SuperAdmin Employee DeliveryPartner].each do |role_name|
  Role.create(name: role_name)
end

# Create UserRole associations
User.all.each do |user|
  user.roles << Role.all.sample
end

# Create BookCategory records
['Fiction', 'Non-Fiction', 'Science Fiction', 'Fantasy'].each do |category_name|
  Category.create!(name: category_name)
end

# Create Subcategory records
%w[Mystery Romance History Self-Help].each do |subcategory_name|
  Subcategory.create!(
    name: subcategory_name,
    category: Category.all.sample
  )
end

# Create Author records
10.times do
  Author.create!(name: Faker::Book.author)
end

# Create Publisher records
5.times do
  Publisher.create!(name: Faker::Book.publisher)
end

# Create Book records
image_name = Rails.root.join('app/assets/images', 'bookfour.png')
image_data = File.read(image_name)
20.times do
  Book.create!(
    name: Faker::Book.title,
    category: Category.all.sample,
    subcategory: Subcategory.all.sample,
    author: Author.all.sample,
    isbn_number: Faker::Code.isbn,
    image_name: image_name,
    publisher: Publisher.all.sample,
    user: User.all.sample,
    amount: Faker::Commerce.price(range: 10.0..1000.0),
    availability: true
  )
end

# Create Book records
20.times do
 order = Order.create!(
        order_type: %w[BUY RENT].sample,
        date: Faker::Date.between(from: 1.year.ago, to: Date.today),
        book: Book.all.sample,
        corporate: Corporate.all.sample,
        user: User.all.sample,
        status: %w[ORDERED ORDER_PICKEDUP ORDER_SHIPPED
                  ORDER_DELIVERED ORDER_CANCELLED ORDER_RETURNED].sample,
        amount: Faker::Commerce.price(range: 10.0..1000.0)
      )
  3.times do
    OrderHistory.create!(order_id: order.id, 
    delivery_user_id:  Role.find_by_name('DeliveryPartner').users.first.id,
    order_user: order.user,
    status: %w[ORDERED ORDER_PICKEDUP ORDER_SHIPPED
    ORDER_DELIVERED ORDER_CANCELLED ORDER_RETURNED].sample)
  end
end

puts 'Seed data created successfully!'
