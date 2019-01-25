import { Component, OnInit, ViewChild } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import { Router } from '@angular/router';
import { WindowRef } from '../../services/window-ref';

import { IndexService } from '../../services/index.service';
import { DirectoryService } from '../../services/directory.service';
import { UserService } from '../../services/user.service';
import { DocumentService } from '../../services/document.service';
import { BridgeService } from '../../services/bridge.service';
import { GlobalDataService } from '../../services/data.service';
import { HtmlDocumentFacade } from '../../facades/html.document.facade';
import { DeleteConfirmationDialogComponent } from "../delete-confirmation-dialog/delete.confirmation.dialog.component";
import { MatDialog, MatDialogConfig } from "@angular/material";

@Component({
  selector: 'sidebar',
  templateUrl: './list-sidebar.component.html',
  styleUrls: ['./list-sidebar.component.css']
})

export class ListSidebarComponent implements OnInit {

  sorted = true;
  hide = false;
  items = [];
  itemsCopy = [];
  error = false;
  loading = false;
  listView = true;
  treeView = false;
  prefix = null;
  suggestions = [];
  users = null;

  reloadPending = false;

  fullSearchMatchedItems = [];

  showPartialSearchLink = false;
  showPartialSearchTitle = false;
  showNoFullResults = false;
  showNoPartialResults = false;
  showCharLimitMessage = false;
  showPartialResults = false;
  searchText = "";

  partialItems = [];
  fullMatchedKeys = {};
  partialMatchedKeys = {};

  MAX_WORDS_PER_SEARCH = 3;
  MAX_STRING_SIZE = 20;
  selectedItem = null;
  selectedStyle = 'selected';

  selectItem(event) {
    console.log(event);

    if (this.selectedItem) {
      let classList = this.selectedItem.classList;
      classList.remove(this.selectedStyle);
    }

    let classList = event.currentTarget.classList;
    classList.add(this.selectedStyle);
    this.selectedItem = event.currentTarget;

  }

  filterNodes(text) {
    // debouncing 
    if (this.searchText === text) {
      return;
    }

    this.showPartialSearchLink = false;
    this.showPartialSearchTitle = false;
    this.showNoPartialResults = false;
    this.showNoFullResults = false;
    this.showPartialResults = false;
    this.partialItems = [];
    this.fullSearchMatchedItems = [];
    this.fullMatchedKeys = {};
    this.partialMatchedKeys = {};

    this.searchText = text;
    // Minimum two chacters before search starts
    if (text && text.length > 2) {
      this.showCharLimitMessage = false;
      this.debounce(this.search, 200)(this.searchText);
    } else {
      this.sorted = true;
      if (this.reloadPending) {
        this.reloadPending = false;
        this.loadList();
      } else {
        this.items = this.itemsCopy;
      }
    }
  };

  debounce = (func, delay) => {
    let inDebounce;
    const context = this;
    return function (text) {
      clearTimeout(inDebounce);
      inDebounce = setTimeout(() => func.apply(context, [text]), delay);
    }
  };

  loadPartialMatches() {
    this.showPartialSearchLink = false;
    this.showPartialSearchTitle = true;
    this.loading = true;
    this.searchPartials(this.searchText);
  };

  searchPartials(text) {
    // search each word
    let words = text.split(" ");
    let responses = [];
    let uniqeWordsList = [];
    let uniqeWordsMap = {};

    let ignoredWords = 0;
    words.forEach((word) => {
      word = word.trim();
      word = word.toLowerCase();
      if (!uniqeWordsMap[word]) {
        // no need to search single characters
        if (word.length > 2 && word.length <= this.MAX_STRING_SIZE) {
          uniqeWordsList.push(word);
          uniqeWordsMap[word] = null;
          responses.push(this.indexService.search(encodeURIComponent(word)));
        } else {
          // TODO : if word is larger that max_string_size
          console.warn('Word size is ' + word.length + ' ' + word);
          ignoredWords++;
        }
      }
    });

    if(ignoredWords === words.length) {
      this.loading = false;
      return;
    }

    console.log(uniqeWordsMap);
    console.log(uniqeWordsList);

    Observable.forkJoin(responses).subscribe(responseList => {

      let _partialMatchedKeys = {};
      let _wordsAndItemsMap = {};

      for (let i = 0; i < responseList.length; i++) {
        for (let key in responseList[i]) {

          if (responseList[i].hasOwnProperty(key)
            && !this.fullMatchedKeys.hasOwnProperty(key)) { // ignore if already in fully matched documents
            if (!_wordsAndItemsMap[key]) {
              _wordsAndItemsMap[key] = {};
            }
            // response index is same as words index
            if (uniqeWordsList[i].trim().length > 0) { // ignore empty string for UI
              _wordsAndItemsMap[key][uniqeWordsList[i]] = null;
            }
            _partialMatchedKeys[key] = null;
          }
        }
      }

      console.log(_partialMatchedKeys);
      console.log(_wordsAndItemsMap);

      let filteredList = [];

      this.itemsCopy.forEach((item) => {
        if (_partialMatchedKeys.hasOwnProperty(item._id)) {
          filteredList.push(item);
          item.matchedWords = [];
          for (let word in _wordsAndItemsMap[item._id]) {
            if (_wordsAndItemsMap[item._id].hasOwnProperty(word)) {
              item.matchedWords.push(word);
            }
          }
        }
      });

      this.partialItems = sort(filteredList);

      if (this.partialItems.length === 0) {
        this.showNoPartialResults = true;
      }
      this.loading = false;
      this.showPartialResults = true;
    });

    function sort(filteredList) {
      let sortedList = [];
      let _wordCountMap = [];
      filteredList.forEach(function (item) {
        let wordCount = item.matchedWords.length;
        if (!_wordCountMap[wordCount]) {
          _wordCountMap[wordCount] = [];
        }
        _wordCountMap[wordCount].push(item);
      });

      console.log(_wordCountMap);

      function reverse(array, index) {
        if (array.length <= index) {
          return;
        }
        reverse(array, index + 1);
        if (array[index]) {
          sortedList = sortedList.concat(array[index]);
        }
      }

      reverse(_wordCountMap, 0);
      return sortedList;
    };

  };

  titleBasedFiltered(text) {
    text = text.toLowerCase();
    let filtered = [];
    this.itemsCopy.forEach((item) => {
      if (item.title.toLowerCase().indexOf(text)>= 0) {
        filtered.push(item);
      }
    });
    return filtered;
  }

  search(text) {

    this.loading = true;
    let titleMatches = [];

    let subTexts = [];  

    for (let i = 0; i < text.length; i++) {
      subTexts.push(text.substring(i, i + this.MAX_STRING_SIZE));
      i = i + this.MAX_STRING_SIZE;
    }

    console.log(subTexts);
    let ignoredWords = 0;
    let responses = [];

    subTexts.forEach((text) => {
      text = text.replace(/\s\s+/g, ' ');
      text = text.trim();
      if (text.length > 2 && text.length <= this.MAX_STRING_SIZE) {
        responses.push(this.indexService.search(encodeURIComponent(text)));
      } else {
        console.warn('Text size is ' + text.length);
        ignoredWords++;
      }
    });

    titleMatches = this.titleBasedFiltered(text);

    let titleMatchesMap = {};
    titleMatches && titleMatches.forEach((titleMatch) => {
      //if (titleMatches.hasOwnProperty(titleMatch._id)) {
        titleMatchesMap[titleMatch._id] = titleMatch;
     // }
    });

    
    this.items = titleMatches;

    if(ignoredWords === subTexts.length) {
      this.loading = false;
      return;
    }

    Observable.forkJoin(responses).subscribe(responseList => {
      console.log(responseList);
      let result = responseList[0];
      // only common keys in all results are exact match
      // rest are ignored
      if (result && responseList.length > 1) {
        for (let i = 1; i < responseList.length; i++) {
          for (let key in result) {
            if (!(responseList[i] && responseList[i].hasOwnProperty(key))) {
              // delete if said key is not in result
              delete result[key];
            }
          }
        }
      }

      console.log(result);

      let filteredList = [];
      result && this.itemsCopy.forEach((item) => {
        if (result.hasOwnProperty(item._id) && !titleMatchesMap[item._id]) {
          filteredList.push(item);
        }
      });

      // Used by partial matches to avoid duplicate display.
     // this.fullMatchedKeys = result ? result : {};
     this.fullMatchedKeys = {...result, ...titleMatchesMap};
      
      if (filteredList.length === 0 && titleMatches.length === 0) {
        this.showNoFullResults = true;
      }

      this.sorted = false;
      this.items = titleMatches.concat(filteredList);
      if(text.split(' ').length > 1) {
        this.showPartialSearchLink = true;
      }      
      this.loading = false;
    });

  };

  loadList() {
    if (this.searchText) {
      this.reloadPending = true;
      return;
    }

    this.loading = true;

    /*this.documentService.getAll().subscribe(
      (res: any) => {
        this.items = res;
        this.itemsCopy = this.items;
        this.loading = false;
      },
      error => {
        console.log(error);
        this.error = true;
        this.loading = false;
      });*/

    let responses = [];
    responses.push(this.documentService.getAll());
    responses.push(this.userService.getAllUsers());
    Observable.forkJoin(responses).subscribe((responseList: any) => {

      let users = {};
      responseList[1] && responseList[1].forEach((user) => {
        users[user.userName] = user.displayName ? user.displayName : user.userName;
      });

      this.users = users;

      this.dataService.put('user-info', users); // for global use

      this.items = responseList[0];
      this.itemsCopy = this.items;
      this.loading = false;
    }, error => {
      console.log(error);
      this.error = true;
      this.loading = false;
    });
  }

  refreshList(message) {
    if (message.token === 'document-added') {
      this.loadList();
    }    
    if (message.token === 'document-indexed') {
      this.loadList();
    }
  }

delete(id) {
	const config = new MatDialogConfig();
	config.disableClose = true;
	config.autoFocus = true;
	config.width = '350px';
	const confirmationDialog = this.dialog.open(DeleteConfirmationDialogComponent, config);
	confirmationDialog.afterClosed().subscribe((decision) => {
		if (decision === true) {
			this.htmlDocumentFacade.delete(id);
			this.loadList();
		}
		return false;
	});
}
	
  delete_old(event, id) {
    console.log('Deleting ' + id);
    event.preventDefault();
    event.stopPropagation();
    this.documentService.delete(id).subscribe((res: any) => {
      console.log(res);
      console.log('Document deleted !');
      if (id === this.dataService.get('opened-blog')._id) {
        this.router.navigate(['/'], { skipLocationChange: true });
      }
      this.loadList();
    });
    return false;
  }

  edit(event, id) {
    console.log(id);
    event.preventDefault();
    event.stopPropagation();
    this.router.navigate(['edit/html', id], { skipLocationChange: true });
    return false;
  }

  public ngOnInit(): void {
    this.loadList();
  }

  constructor(
    private documentService: DocumentService,
    private indexService: IndexService,
    private dataService: GlobalDataService,
    private userService: UserService,
	private htmlDocumentFacade: HtmlDocumentFacade,
    // private window: WindowRef,
    private router: Router,
	private dialog: MatDialog,
    private bridgeService: BridgeService) {
    this.bridgeService.currentMessage.subscribe((message: any) => { this.refreshList(message); 
      if (message.token === 'enable_reader_mode') {
				this.hide = true;
			}
			if (message.token === 'disable_reader_mode') {
				this.hide = false;
      }
    });
  }

}
