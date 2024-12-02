class CreateBooks < ActiveRecord::Migration[7.0]
  def change
    create_table :books do |t|
      t.string :name
      t.integer :category_id
      t.integer :subcategory_id
      t.integer :author_id
      t.integer :user_id
      t.integer :publisher_id
      t.string :isbn_number
      t.string :image_name
    

      t.timestamps
    end
     add_index("books" ,"category_id")
     add_index("books","subcategory_id")
     add_index("books", "author_id")
     add_index("books", "user_id")
     add_index("books", "publisher_id")
  end
 
end
