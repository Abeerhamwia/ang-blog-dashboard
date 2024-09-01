import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { CategoriesService } from 'src/app/services/categories.service';

@Component({
  selector: 'app-new-post',
  templateUrl: './new-post.component.html',
  styleUrls: ['./new-post.component.css']
})
export class NewPostComponent implements OnInit {

  permalink: string = '';
  imgSrc: string = './assets/placeholder-image.png';
  selectedImg: any;
  categories: Array<object> | any;
  postForm: FormGroup;

  constructor(private categoryService: CategoriesService, private fb: FormBuilder) {
    this.postForm = this.fb.group({
      title: [''],
      permalink: [{value: '', disabled: true}],
      excerpt: [''],
      category: [''],
      postImg: [''],
      content: ['']
    });
  }

  ngOnInit(): void {
    this.categoryService.loadData().subscribe(val => {
      this.categories = val;
    });
  }

  onTitleChanged($event: any) {
    const title = $event.target.value;
    this.permalink = title.replace(/\s/g, '-');
    this.postForm.patchValue({ permalink: this.permalink });
  }

  showPreview($event: any) {
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result;
      this.imgSrc = typeof result === 'string' ? result : './assets/placeholder-image.png';
    };

    if ($event.target.files.length > 0) {
      reader.readAsDataURL($event.target.files[0]);
      this.selectedImg = $event.target.files[0];
      this.postForm.patchValue({ postImg: this.selectedImg });
    } else {
      this.imgSrc = './assets/placeholder-image.png';
    }
  }
}
