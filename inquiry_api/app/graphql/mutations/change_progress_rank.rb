module Mutations
  class ChangeProgressRank < BaseMutation
    argument :id, ID, required: true
    argument :rank, Types::ProgressRankEnum, required: true

    type Types::ProgressType

    def resolve(id:, rank:)
      menu = Menu.find id
      menu.send "#{rank}!"
      menu
    end
  end
end
