# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Mutations::DeleteComment, type: :request do
  let(:comment) { create :comment }
  def input(id)
    <<~INPUT
      mutation {
        deleteComment(input: { id: "#{id}" }) {
          id
          content
        }
      }
    INPUT
  end

  describe '正常な値を与えた場合' do
    it 'レコードが削除される' do
      result = AppSchema.execute input(comment.id)
      is_asserted_by { result.dig('data', 'deleteComment', 'content') == comment.content }
      is_asserted_by { Comment.find_by_id(comment.id).nil? }
    end
  end

  describe '存在しないIDを指定した場合' do
    it 'errorsフィールドにエラー内容が生成され、レコードは削除されない' do
      result = AppSchema.execute input(0)
      is_asserted_by { result.key?('errors') }
      is_asserted_by { Comment.find(comment.id).present? }
    end
  end
end
