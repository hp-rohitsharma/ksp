import { Component, OnInit, ViewChild, HostListener, AnimationKeyframesSequenceMetadata } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import { Router } from '@angular/router';
import { WindowRef } from '../../services/window-ref';
import { MatDialog, MatDialogConfig } from "@angular/material";

import { IndexService } from '../../services/index.service';
import { DirectoryService } from '../../services/directory.service';
import { UserService } from '../../services/user.service';
import { DocumentService } from '../../services/document.service';
import { BridgeService } from '../../services/bridge.service';
import { GlobalDataService } from '../../services/data.service';

import { DeleteConfirmationDialogComponent } from "../delete-confirmation-dialog/delete.confirmation.dialog.component";

import { HtmlDocumentFacade } from '../../facades/html.document.facade';

import { FolderView } from './folder-view/folder.view'

declare var $: any;

@Component({
  selector: 'sidebar',
  templateUrl: './tree-sidebar.component.html',
  styleUrls: ['./tree-sidebar.component.css']
})

export class TreeSidebarComponent implements OnInit {

  root: any;
  links: any;
  selectedTreeNode: { element: any, data: any } = { element: {}, data: {} };
  selectedStyle = 'selected';

  public ngOnInit(): void {

    this.loadTree();
   /* this.root = {
      name: "/",
      folders: [
        {
          name: "tree-sidebar.component.html",
          id: 1,
          folders: [
            {
              name: "3",
              id: 1,
              folders: [],
              files: []
            },
            {
              name: "4",
              folders: [
                {
                  name: "3",
                  id: 1,
                  folders: [],
                  files: []
                }
              ],
              files: [
                {
                  name: '5',
                  id: 1,
                  class: 'html fa fa-file-code-o'
                },
                {
                  name: '6',
                  id: 1,
                  class: 'html fa fa-file-code-o'
                },
              ]
            }
          ],
          files: [
            {
              name: '5',
              class: 'html fa fa-file-code-o',
              id: 1
            },
            {
              name: '6',
              id: 1,
              class: 'pdf fa fa-file-pdf-o'
            },
          ]
        },
        {
          name: "7",
          id: 1,
          folders: [],
          files: []
        }
      ],
      files: [
        {
          name: '8',
          id: 1,
          class: 'html fa fa-file-code-o'
        },
        {
          name: '9',
          id: 1,
          class: 'html fa fa-file-code-o'
        },
      ]
    };*/
  };

  loading = false;
  isShown = false;
  error = false;
  private mouseLocation: { left: number, top: number } = { left: 0, top: 0 };

  file_menu = [
    { title: 'Open', action: 'open_blog' },
    { title: 'Edit', action: 'edit_blog' },
    { title: 'Delete', action: 'delete_file' },
    { title: 'Information', action: 'file_information' }
  ]

  folder_menu = [
    { title: 'Add Folder', action: 'new_folder' },
    { title: 'Add Blog', action: 'new_blog' },
    { title: 'Add PDF', action: 'new_pdf' },
    { title: 'Rename', action: 'rename' },
    { title: 'Delete', action: 'delete_folder' },
    { title: 'Information', action: 'folder_information' }
  ]

  loadTree() {
    this.loading = true;
    Observable.forkJoin(
      this.documentService.getAll().map((res: Response) => res),
      this.directoryService.get().map((res: Response) => res)
    ).subscribe(
      (res: any) => {
        this.makeTreeModel(res[0], res[1]);
        this.loading = false;
      },
      error => {
        console.log(error);
        this.error = true;
        this.loading = false;
      });
  }

  makeTreeModel(docs, directory) {

    let folderInfo = directory.infoMap;

    let root = {
      name: '/',
      id: 1,
      files: [],
      folders: []
    }

    let leafs = docs;
    let index = {};

    for (let i in leafs) {
      let leaf = {
        name: leafs[i].title, // file name
        id: leafs[i]._id,
        type: leafs[i].type,
        parentId: leafs[i].parentId,
        class: leafs[i].type.indexOf('html') > -1 ? 'html fa fa-file-code-o' : 'pdf fa fa-file-pdf-o'
      }
      this.buildTree(leaf, root, index, folderInfo, false);
    }

    for (let j in folderInfo) {
      if (folderInfo.hasOwnProperty(j)) {
        let leaf = {
          name: folderInfo[j].name, // folder name
          id: folderInfo[j].id,
          parentId: folderInfo[j].parentId,
          files: [],
          folders: []
        }
        this.buildTree(leaf, root, index, folderInfo, true);
      }
    }

    this.postProcess(root);
    this.root = root;
  }

  /**
     * It uses bottom up approach, staring from leaf node and making its way to root. 
     * @param item : leaf folder or file
     * @param root : name says it all
     * @param index : list of already processed folders, so that if some decendent folder comes for 
     * processing after this then process it till the folder in index and add it to child to complete the path.
     * @param folderInfo : folder id and its information (name, creator etc..)
     * @param directoryMap : who is who's parent
     */
  buildTree(leaf, root, index, folderInfo, isFolder) {

    if (leaf.parentId) {

      while (leaf.parentId) {
        /**
         *  Case : when parent is root node
         */
        if (leaf.parentId == 1) {
          if (isFolder) {
            root.folders.push(leaf);
            index[leaf.id] = leaf;
          } else {
            root.files.push(leaf);
          }
          return; // as we have reached the root
        }
        /**
         * Case : when  parent folder is aleady processed
         */
        else if (index[leaf.parentId]) {

          if (isFolder) {
            index[leaf.parentId].folders.push(leaf);
            index[leaf.id] = leaf;
          } else {
            index[leaf.parentId].files.push(leaf);
          }
          return; // as parent is already processed

        } else {
          // Retreive parent folder of leaf and append leaf to it.
          let parentFolder = folderInfo[leaf.parentId];
          if (parentFolder) {

            let parentFolderNode = {
              name: parentFolder.name,
              id: parentFolder.id,
              creator: parentFolder.creator,
              parentId: parentFolder.parentId,
              files: [],
              folders: []
            }

            delete folderInfo[leaf.parentId];
            // Remove as it is processed, so in the end we know 
            // which fodler swere not procesed and consider themas leaf folders

            if (isFolder) {
              parentFolderNode.folders.push(leaf);
              index[leaf.id] = leaf;
            } else {
              parentFolderNode.files.push(leaf);
            }

            leaf = parentFolderNode;
            isFolder = true;
          }
          // when blog is there but parent folder is deleted
          else {
            // add to root node
            leaf.parentId = 1;
          }
        }
      }

    } else {
      // add to root if no parent found or parent is root
      if (isFolder) {
        root.folders.push(leaf);
      } else {
        root.files.push(leaf);
      }
    }
  }

  postProcess(node) {
    node.children = node.folders.concat(node.files);
    node.folders.forEach(element => {
      this.postProcess(element);
    });
  }

  onMenuSelection(event, action) {
    let treeNode = this.selectedTreeNode;
    if (treeNode.element.className.indexOf('folder') >= 0) {
      if (action === 'new_folder') {
        let newFolder = {
          name: "New Folder",
          id: new Date().getTime(),
          folders: [],
          files: []
        }
        treeNode.data.folders.unshift(newFolder);
        setTimeout(() => {
          let folderView = treeNode.element.parentElement.parentElement.querySelector('folder-view');
          let newFolderElement = folderView.querySelector('.folder');
          this.processSelectedNode({ element: newFolderElement , data : newFolder});
        }, 0);
      } else if (action === 'new_blog') {
        this.router.navigate(['create/html'], { skipLocationChange: true });
      } else if (action === 'new_pdf') {
        // handled in html
      } else if (action === 'delete_folder') {

      } else if (action === 'folder_information') {

      } else if (action === 'rename') {
        let folderTitle = treeNode.element.getElementsByClassName('folder-title')[0];
        folderTitle.setAttribute('contenteditable', true);
        folderTitle.classList.add('editable');
        folderTitle.focus();
      }
    } else if (treeNode.element.className.indexOf('file') >= 0) {
      if (action === 'open_blog') {
        this.router.navigate(['view/html', treeNode.data.id], { skipLocationChange: true });
      } else if (action === 'edit_blog') {
        this.router.navigate(['edit/html', treeNode.data.id], { skipLocationChange: true });
      } else if (action === 'delete_file') {
        setTimeout(() => { this.deleteFile(treeNode.data.id) }, 0);
      } else if (action === 'file_information') {

      }
    }
    this.isShown = false;
  }

  upload(file) {
    this.globalDataService.put('file', file);
    this.router.navigate(['upload/pdf'], { skipLocationChange: true });
  }

  deleteFile(id) {
    const config = new MatDialogConfig();
    config.disableClose = true;
    config.autoFocus = true;
    config.width = '350px';
    const confirmationDialog = this.dialog.open(DeleteConfirmationDialogComponent, config);
    confirmationDialog.afterClosed().subscribe((decision) => {
      if (decision === true) {
        this.htmlDocumentFacade.delete(id);
      }
      return false;
    });
  }

  onRightClick(event, data) {
    this.isShown = false;
    this.showMenu(event);
    event.stopPropagation();
  }

  showMenu(event) {
    this.isShown = true;
    this.mouseLocation = {
      left: event.clientX,
      top: event.clientY
    }
  }

  renameFolder() {
    let folder = this.selectedTreeNode.element.querySelector('.folder-title');
    folder.removeAttribute('contenteditable');
    folder.classList.remove('editable');
    console.log(this.selectedTreeNode);
  }

  get locationCss() {
    return {
      'position': 'fixed',
      'display': this.isShown ? 'block' : 'none',
      left: this.mouseLocation.left + 10 + 'px',
      top: this.mouseLocation.top + 10 + 'px',
    };
  }

  @HostListener('document: click', ['$event'])
  public documentClick(event: Event): void {
    this.isShown = false;
    /*  if (this.selectedTreeNode.element.querySelector('.folder-title') !== event.target) {
        this.renameFolder();
      }*/
  }

  @HostListener('document: contextmenu', ['$event'])
  public documentRClick(event: any): void {
    // this.isShown = false;
    //let path = event.path;
    return;
    /* path.forEach(element => {
       if (element.className) {
         if (element.className.indexOf('folder') >= 0) {
           // this.processSelectedNode(element);
           this.links = this.folder_menu;
           this.onRightClick(event, null);
           return;
         } else if (element.className.indexOf('file') >= 0) {
           // this.processSelectedNode(element);
           this.links = this.file_menu;
           this.onRightClick(event, null);
           return;
         }
       }
     });*/
  }

  @HostListener('document:keypress', ['$event'])
  public documentKey(event: any): void {
    if (event.keyCode === 13) {
      console.log(this.selectedTreeNode);
      if (event.target.className.indexOf('folder-title') >= 0) {
        this.renameFolder();
      }
    }
  }

  processSelectedNode(message) {

    if (this.selectedTreeNode.element.classList) {
      let classList = this.selectedTreeNode.element.classList;
      classList.remove(this.selectedStyle);
    }

    let classList = message.element.classList;
    classList.add(this.selectedStyle);
    this.selectedTreeNode.element = message.element;
    this.selectedTreeNode.data = message.data;
  }

  treeNodeActionListener(message) {
    if (message.token === 'tree-node-clicked') {
      if (message.element.className.indexOf('file') >= 0) {
        this.processSelectedNode(message);
        this.router.navigate(['view/html', message.data.id], { skipLocationChange: true });
      } else if (message.element.className.indexOf('folder') >= 0) {
        this.selectedTreeNode.data.open = false;
        this.processSelectedNode(message);
        this.selectedTreeNode.data.open = true;
      }
    } else if (message.token === 'tree-node-contextmenu') {

      this.processSelectedNode(message);
      this.isShown = false;

      if (message.element.className) {
        if (message.element.className.indexOf('folder') >= 0) {
          this.links = this.folder_menu;
          this.onRightClick(event, null);
          return;
        } else if (message.element.className.indexOf('file') >= 0) {
          this.links = this.file_menu;
          this.onRightClick(event, null);
          return;
        }
      }
    }
  }

  constructor(
    private globalDataService: GlobalDataService,
    private bridgeService: BridgeService,
    private documentService: DocumentService,
    private directoryService: DirectoryService,
    private dialog: MatDialog,
    private htmlDocumentFacade: HtmlDocumentFacade,
    private router: Router) {
    this.bridgeService.currentMessage.subscribe((message) => { this.treeNodeActionListener(message); });
  }
}
