class BookPolicy < ApplicationPolicy
  class Scope < Scope
    def create?
      user.has_role?(:admin) # Only admin can create posts
    end
  
    def update?
      user.has_role?(:admin) || record.user == user # Admin or the post's owner can update
    end
  
    def destroy?
      user.has_role?(:admin) || record.user == user # Admin or the post's owner can delete
    end
  end
end
