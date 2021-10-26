package graph

// This file will be automatically regenerated based on the schema, any resolver implementations
// will be copied through when generating and any unknown code will be moved to the end.

import (
	"context"
	"fmt"
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

// !!! WARNING !!!
// The code below was going to be deleted when updating resolvers. It has been copied here so you have
// one last chance to move it out of harms way if you want. There are two reasons this happens:
//  - When renaming or deleting a resolver the old code will be put in here. You can safely delete
//    it when you're done.
//  - You have helper methods in this file. Move them out to keep these resolver files clean.
func (r *entityResolver) FindCommentByID(ctx context.Context, id string) (*model.Comment, error) {
	panic(fmt.Errorf("not implemented"))
}
func (r *entityResolver) FindProgressByID(ctx context.Context, id string) (*model.Progress, error) {
	panic(fmt.Errorf("not implemented"))
}
