class Team < ApplicationRecord
  has_many :players, dependent: :destroy #when a team goes away...all its players die??
  accepts_nested_attributes_for :players, allow_destroy: true #submit team and its players and same time
  # allow_destroy: allows you to delete a player in the nested form
end
