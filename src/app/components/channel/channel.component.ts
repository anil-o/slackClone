import { AfterViewInit, Component, OnDestroy } from '@angular/core';
import { ChannelService } from 'src/app/services/channel.service';

@Component({
  selector: 'app-channel',
  templateUrl: './channel.component.html',
  styleUrls: ['./channel.component.scss'],
})
export class ChannelComponent implements AfterViewInit, OnDestroy {
  constructor(public channelService: ChannelService) {}

  ngAfterViewInit(): void {
    this.channelService.loadChannelContent('gruppe-576');
    this.scrollToBottomOfContent();
  }

  ngOnDestroy(): void {
    this.channelService.channelReady = false;
  }

  scrollToBottomOfContent(): void {
    let content = document.getElementById('channel-content');
    content.scrollTo(0, content.scrollHeight);
  }
}
