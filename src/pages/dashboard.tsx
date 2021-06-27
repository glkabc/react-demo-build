/** @jsxImportSource @emotion/react */
import * as React from 'react';
import { MdMenu, MdChevronLeft, MdChevronRight } from 'react-icons/md';
import { SerializedStyles, useTheme, css } from '@emotion/react';
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Drawer,
  Divider,
} from '@material-ui/core';

import Navigation from './dashboard/navigation';

function Dashboard({ children }: { children: React.ReactNode }) {
  const theme = useTheme();
  const [drawerOpen, setDrawerOpen] = React.useState(false);

  const handleDrawOpen = () => {
    setDrawerOpen(true);
  };

  const handleDrawClose = () => {
    setDrawerOpen(false);
  };

  const getDrawerTransitionWidthProps = (props: string[] = []) => {
    return theme.transitions.create(props, {
      easing: theme.transitions.easing.sharp,
      duration: drawerOpen
        ? theme.transitions.duration.leavingScreen
        : theme.transitions.duration.enteringScreen,
    });
  };

  // TODO
  // theme.mixins.toobar 返回的对象实际上可以很好的在emotion的css api中使用，
  // 但是ts类型的问题阻止这么用，暂时用类型强制转换的方法解决
  const toolbarMinxin = theme.mixins.toolbar as unknown as SerializedStyles;

  const drawerStyle = css({
    flexShrink: 0,
    whiteSpace: 'nowrap',
  });

  const drawerEnhanceStyle = css({
    width: drawerOpen ? theme.dashboardDrawerWidth : theme.spacing(7) + 1,
    overflowX: drawerOpen ? 'auto' : 'hidden',
    transition: getDrawerTransitionWidthProps(['width']),
  });

  const drawerPaperStyle = css({
    '.MuiDrawer-paper': drawerEnhanceStyle,
  });

  const appBarPlaceholderStyle = css({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: theme.spacing(0, 1),
    ...toolbarMinxin,
  });

  return (
    <div css={{ display: 'flex', height: '100%' }}>
      <AppBar
        elevation={0}
        position="fixed"
        css={{
          zIndex: theme.zIndex.drawer + 1,
          width: drawerOpen
            ? `calc(100% - ${theme.dashboardDrawerWidth}px)`
            : '100%',
          marginLeft: drawerOpen ? theme.dashboardDrawerWidth : 0,
          transition: getDrawerTransitionWidthProps(['width', 'margin']),
        }}
      >
        <Toolbar>
          <IconButton
            edge="start"
            css={{
              marginRight: 36,
              display: drawerOpen ? 'none' : 'inline-flex',
            }}
            onClick={handleDrawOpen}
          >
            <MdMenu />
          </IconButton>
          <Typography variant="h6" noWrap>
            智慧校园能力平台
          </Typography>
        </Toolbar>
      </AppBar>
      <Drawer
        variant="permanent"
        css={[drawerStyle, drawerEnhanceStyle, drawerPaperStyle]}
      >
        <div css={appBarPlaceholderStyle}>
          <IconButton onClick={handleDrawClose}>
            {theme.direction === 'rtl' ? <MdChevronRight /> : <MdChevronLeft />}
          </IconButton>
        </div>
        <Divider />
        <Navigation drawerOpen={drawerOpen} setDrawerOpen={setDrawerOpen} />
      </Drawer>
      <main
        css={{
          flexGrow: 1,
          padding: theme.spacing(3),
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <div css={appBarPlaceholderStyle} />
        {children}
      </main>
    </div>
  );
}

export default Dashboard;
