package main

import (
	"fmt"
	"io/ioutil"
	"math/rand"
	"os"
	"time"

	"batch/database/inquiry_api"
	"batch/database/staff_api"
	"batch/database/user_api"
	"batch/entity"

	"github.com/jszwec/csvutil"
	"golang.org/x/crypto/bcrypt"
)

func main() {
	if os.Getenv("GO_ENV") == "" {
		os.Setenv("GO_ENV", "development")
	}
	staffIDs := staffInsert()
	userIDs := userInsert()
	inquiryInsert(staffIDs, userIDs)
}

func staffInsert() []uint {
	var staffs []*entity.Staff

	b, _ := ioutil.ReadFile("seed/csv/staffs.csv")
	csvutil.Unmarshal(b, &staffs)
	hashed, _ := bcrypt.GenerateFromPassword([]byte("password"), 10)

	for _, staff := range staffs {
		staff.PasswordDigest = hashed
	}

	staff_api.Connect()
	db := staff_api.GetDB()
	db.Exec("DELETE FROM staffs")
	sr := db.Create(&staffs)
	fmt.Printf("created %d staffs\n", sr.RowsAffected)

	var result []uint
	for _, staff := range staffs {
		result = append(result, staff.ID)
	}

	return result
}

func userInsert() []uint {
	var users []*entity.User
	ub, _ := ioutil.ReadFile("seed/csv/users.csv")
	csvutil.Unmarshal(ub, &users)

	var addresses []*entity.Address
	ab, _ := ioutil.ReadFile("seed/csv/addresses.csv")
	csvutil.Unmarshal(ab, &addresses)

	for i, user := range users {
		address := addresses[i]
		user.Address = *address
	}

	user_api.Connect()
	db := user_api.GetDB()
	db.Exec("DELETE FROM addresses")
	db.Exec("DELETE FROM users")
	ur := db.Create(&users)
	fmt.Printf("created %d users\n", ur.RowsAffected)

	var result []uint
	for _, user := range users {
		result = append(result, user.ID)
	}

	return result
}

func inquiryInsert(staffIDs []uint, userIDs []uint) {
	rand.Seed(time.Now().UnixNano())

	var inquiries []*entity.Inquiry
	ib, _ := ioutil.ReadFile("seed/csv/inquiries.csv")
	csvutil.Unmarshal(ib, &inquiries)

	var progresses []*entity.Progress
	pb, _ := ioutil.ReadFile("seed/csv/progresses.csv")
	csvutil.Unmarshal(pb, &progresses)

	var menus []*entity.Menu
	mb, _ := ioutil.ReadFile("seed/csv/menus.csv")
	csvutil.Unmarshal(mb, &menus)

	var comments []*entity.Comment
	cb, _ := ioutil.ReadFile("seed/csv/comments.csv")
	csvutil.Unmarshal(cb, &comments)

	inquiry_api.Connect()
	db := inquiry_api.GetDB()
	db.Exec("DELETE FROM comments")
	db.Exec("DELETE FROM progresses")
	db.Exec("DELETE FROM menu_inquiry_attachments")
	db.Exec("DELETE FROM menus")
	db.Exec("DELETE FROM inquiries")

	// Create Menus
	mr := db.Create(&menus)
	fmt.Printf("created %d menus\n", mr.RowsAffected)

	// Create Inquiries
	for _, inquiry := range inquiries {
		inquiry.UserID = userIDs[rand.Intn(len(userIDs))]
	}
	ir := db.Create(&inquiries)
	fmt.Printf("created %d inquiries\n", ir.RowsAffected)

	// Create Association from Inquiries to Menus
	var assCount int
	var ms []entity.Menu
	for _, m := range menus {
		ms = append(ms, *m)
	}
	for _, inquiry := range inquiries {
		picked := pickMenus(ms)
		var mias []*entity.MenuInquiryAttachment
		for _, menu := range picked {
			mias = append(mias, &entity.MenuInquiryAttachment{MenuID: menu.ID, InquiryID: inquiry.ID})
		}
		miar := db.Create(&mias)
		assCount += int(miar.RowsAffected)
	}
	fmt.Printf("created %d associations from inquiries to menus\n", assCount)

	// Create Progresses
	now := time.Now()
	recontactDate := now.AddDate(0, 0, 7).Format("2006-01-02")
	for i, inquiry := range inquiries {
		staffID := staffIDs[rand.Intn(len(staffIDs))]

		progress := progresses[i]
		if progress.State != "waiting" {
			progress.ContactedAt = &now
		}
		if progress.State == "waiting_recontact" {
			progress.RecontactedOn = &recontactDate
		}
		progress.StaffID = staffID
		progress.InquiryID = inquiry.ID
	}

	pr := db.Create(&progresses)
	if err := pr.Error; err != nil {
		panic(err)
	}
	fmt.Printf("created %d progresses\n", pr.RowsAffected)

	// Create Comments
	roundNum := len(comments) / len(inquiries)
	if roundNum > 0 {
		for i, comment := range comments {
			inqInd := i / roundNum
			inquiry := inquiries[inqInd]
			comment.InquiryID = inquiry.ID
			comment.UserID = inquiry.UserID
		}
	}

	cr := db.Create(&comments)
	if err := cr.Error; err != nil {
		panic(err)
	}
	fmt.Printf("created %d comments\n", cr.RowsAffected)
}

func pickMenus(ms []entity.Menu) []entity.Menu {
	index1, index2 := rand.Intn(len(ms)), rand.Intn(len(ms))
	var ims []entity.Menu
	if index1 == index2 {
		if index1 == len(ms)-1 {
			ims = ms[index1:]
		} else {
			ims = ms[index1:(index1 + 1)]
		}
	} else if index1 < index2 {
		ims = ms[index1:index2]
	} else {
		ims = ms[index2:index1]
	}

	return ims
}
