module Mutations
  class ChangeProgressRank < BaseMutation
    argument :id, ID, required: true
    argument :rank, Types::ProgressRankEnum, required: true

    type Types::ProgressType

    def resolve(id:, rank:)
      progress = Progress.find id
      progress.send "#{rank}!"
      progress
    end
  end
end
