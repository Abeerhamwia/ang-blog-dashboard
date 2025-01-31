import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CategoriesService } from 'src/app/services/categories.service';
import { Post } from 'src/app/models/post';
import { PostsService } from 'src/app/services/posts.service';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { ActivatedRoute } from '@angular/router';
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
  postForm: FormGroup | any;
  post: any;
  formStatus: string = 'Add New';
  docId: string | any;


  constructor(
    private categoryService: CategoriesService, 
    private fb: FormBuilder, 
    private  postService: PostsService, 
    private route: ActivatedRoute
  ){

    this.route.queryParams.subscribe(val => {
      
      this.docId = val['id'];

      if(this.docId) {
        this.postService.loadOneData(val['id']).subscribe((post: any) => {

          this.post = post;
  
          this.postForm = this.fb.group({
            title: [this.post.title, [Validators.required, Validators.minLength(10)]],
            permalink: [{ value: this.post.permalink, disabled: true }, Validators.required],
            excerpt: [this.post.excerpt, [Validators.required, Validators.minLength(50)]],
            category: [`${this.post.category.categoryId}-${this.post.category.category}`, Validators.required],
            postImg: ['', Validators.required],
            content: [this.post.content, Validators.required]
          });
  
          this.imgSrc = this.post.postImgPath;
          this.formStatus = 'Edit';
        });
      } else {
        this.postForm = this.fb.group({
          title: ['', [Validators.required, Validators.minLength(10)]],
          permalink: [{ value: '', disabled: true }, Validators.required],
          excerpt: ['', [Validators.required, Validators.minLength(50)]],
          category: ['', Validators.required],
          postImg: ['', Validators.required],
          content: ['', Validators.required]
        });
      }
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
    this.postForm.get('permalink')?.setValue(this.permalink);
  }

  get fc() {
    return this.postForm.controls;
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

  onSubmit() {

    let splitted = this.postForm.value.category.split('-');
    console.log(splitted);

    const postDate: Post = {
      title: this.postForm.value.title,
      permalink: this.postForm.get('permalink')?.value,
      category: {
        categoryId: splitted[0],
        category: splitted[1]
      },
      postImgPath: '',
      excerpt: this.postForm.value.excerpt,
      content: this.postForm.value.content,
      isFeatured: false,
      views: 0,
      status: 'new',
      createdAt: new Date()
    }
    this.postService.uploadImage(this.selectedImg, postDate, this.formStatus, this.docId);
    this.postForm.reset();
    this.imgSrc = './assets/placeholder-image.png';
    
  }
}
