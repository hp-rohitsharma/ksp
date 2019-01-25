import { Component, Input } from '@angular/core';
import { BridgeService } from '../../../services/bridge.service';

@Component({
  selector: 'folder-view',
  templateUrl: './folder.view.html',
  styleUrls: ['./folder.view.css']
})

export class FolderView {

  @Input() folder: any;

  onClick(event, node) {
    this.bridgeService.changeMessage({ token: 'tree-node-clicked', element: event.currentTarget, data: node });
  }

  onContextMenu(event, node) {
    this.bridgeService.changeMessage({ token: 'tree-node-contextmenu', element: event.currentTarget, data: node });
  }

  constructor(private bridgeService: BridgeService) {
  }
}
