class CreateEnquiries < ActiveRecord::Migration[7.0]
  def change
    create_table :enquiries do |t|
      t.string :name
      t.string :email
      t.string :mobile
      t.text :message, limit: 255
      t.string :role
      t.integer :employee_size
      t.string :company_name, limit: 50

      t.timestamps
    end
  end
end
