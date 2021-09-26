# frozen_string_literal: true

module Mutations
  # Mutation for Destroying User
  class DeleteUser < BaseMutation
    argument :id, ID, required: true
    type Types::UserType

    def resolve(id:)
      user = User.find(id)
      user.destroy! && user
    end
  end
end
