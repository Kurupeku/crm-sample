package graph

// This file will be automatically regenerated based on the schema, any resolver implementations
// will be copied through when generating and any unknown code will be moved to the end.

import (
	"context"
	"staff_api/graph/generated"
	"staff_api/graph/model"
)

func (r *entityResolver) FindStaffByID(ctx context.Context, id string) (*model.Staff, error) {
	return &model.Staff{
		ID: id,
	}, nil
}

// Entity returns generated.EntityResolver implementation.
func (r *Resolver) Entity() generated.EntityResolver { return &entityResolver{r} }

type entityResolver struct{ *Resolver }
