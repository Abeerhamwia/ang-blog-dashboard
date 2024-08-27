import { Component, OnInit } from '@angular/core';
import { CategoriesService } from '../services/categories.service';
import { Category } from '../models/category';


@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.css']
})
export class CategoriesComponent implements OnInit {

  fromCategory: any;
  formStatus: string = 'Add';
  categoryId!: string;
  categoryArray: Array<object> | any;

  constructor( private categoryService: CategoriesService ) {}
  ngOnInit(): void {
    this.categoryService.loadData().subscribe(val => {
      console.log(val);
      this.categoryArray = val;
    });
  }

  onSubmit(formData: any) {

    let categoryData: Category = {
      category: formData.value.category
    }
    console.log('Form Data:', formData.value);

    if( this.formStatus  = 'Add ') {
      this.categoryService.saveData(categoryData);
      formData.reset();
    }
    else if( this.formStatus = 'Edit' ) {
      this.categoryService.updateData(this.categoryId, categoryData);
      formData.reset();
      this.formStatus = 'Add';
    }



    
    // let subcategoryData = {
    //   subcategory: 'subcategory1'
    // }

    // this.afs.collection('categories').add(categoryData).then(docRef => {
    //   console.log(docRef);

    //   this.afs.doc(`categories/${docRef.id}`).collection('subcategories').add(subcategoryData)
    //   this.afs.collection('categories').doc(docRef.id).collection('subcategories').add(subcategoryData).then(docRef1 => {
    //     console.log(docRef1);
    //   })

    //   //this.afs.doc(`categories/${docRef.id}/subcategories/${docRef1.id}`).collection('subsubcategories').add(subcategoryData)
      

    //   this.afs.collection('categories').doc(docRef.id).collection('subsubcategories').add(subcategoryData).then(docRef2 => {
    //     console.log('Second Level Subcategory Saved Successfully');
    //   })
    // })
    // .catch(err => { console.log(err) })
  }

  onEdit(category: any, id: string) {
    this.fromCategory = category;
    this.formStatus = 'Edit';
    this.categoryId = id;
  }

  onDelete(id: string) {
    this.categoryService.deleteData(id);
  }
}
