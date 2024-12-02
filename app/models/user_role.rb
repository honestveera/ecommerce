class UserRole < ApplicationRecord
  belongs_to :user
  belongs_to :role

  def self.create_user_role(user_id, role)
    role = Role.find_by_name(role)
    create(user_id: user_id, role_id: role.id)
  end
end
