# frozen_string_literal: true

class ApplicationController < ActionController::API
  rescue_from ActiveRecord::RecordNotFound, with: :render_not_found
  rescue_from ActionController::RoutingError, with: :render_not_found
  rescue_from Exception, with: :render_internal_server_error

  def render_not_found
    render json: not_found_json, status: :not_found
  end

  def render_internal_server_error
    render json: internal_server_error_json, status: :internal_server_error
  end

  def not_found_json
    { errors: [I18n.t(:not_found, scope: %i[errors routes])], data: nil }.to_json
  end

  def internal_server_error_json
    { errors: [I18n.t(:internal_server_error, scope: %i[errors routes])], data: nil }.to_json
  end
end
