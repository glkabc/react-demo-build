/** @jsxImportSource @emotion/react */
import * as React from 'react';
import {
  List,
  Collapse,
  ListItem,
  ListItemIcon,
  ListItemText,
} from '@material-ui/core';
import { useTheme, css, Theme } from '@emotion/react';
import { Link } from 'react-router-dom';
import { MdExpandMore, MdExpandLess } from 'react-icons/md';

import navigationConfig, {
  NavLinkType,
  NavMenuType,
  isNavLink,
} from './navigationConfig';
import useMenuExpand, { ACTION_TYPE, toggleMenu } from './useMenuExpand';

const menuIconWidth = 24;

interface RenderMenuNodeProp {
  node: NavLinkType | NavMenuType;
  key: number;
  theme: Theme;
  expanded: string[];
  menuDispatch: React.Dispatch<ACTION_TYPE>;
  drawerOpen?: boolean;
  indent?: boolean;
  setDrawerOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

function renderMenuNode({
  node,
  key,
  theme,
  drawerOpen,
  expanded,
  menuDispatch,
  setDrawerOpen,
  indent = false,
}: RenderMenuNodeProp) {
  const nestedStyle = css({
    paddingLeft: theme.spacing(9),
  });

  const listItemStyle = indent ? nestedStyle : undefined;
  const iconStyle = css({
    width: menuIconWidth,
    height: menuIconWidth,
  });
  if (isNavLink(node)) {
    const listItemIcon = node.Icon ? (
      <ListItemIcon>
        <node.Icon css={iconStyle} />
      </ListItemIcon>
    ) : null;
    return (
      <ListItem
        button
        key={key}
        css={listItemStyle}
        component={Link}
        to={node.url}
      >
        {listItemIcon}
        <ListItemText primary={node.label} />
      </ListItem>
    );
  }
  const isExpanded = expanded.includes(node.id);
  return (
    <React.Fragment key={key}>
      <ListItem
        button
        key={key}
        onClick={() => {
          if (drawerOpen) {
            toggleMenu(menuDispatch, node.id);
            return;
          }
          setDrawerOpen(true);
        }}
      >
        <ListItemIcon>
          <node.Icon css={iconStyle} />
        </ListItemIcon>
        <ListItemText primary={node.label} />
        {isExpanded ? (
          <MdExpandLess css={iconStyle} />
        ) : (
          <MdExpandMore css={iconStyle} />
        )}
      </ListItem>
      <Collapse
        in={!drawerOpen ? false : isExpanded}
        timeout="auto"
        unmountOnExit
      >
        <List component="div" disablePadding>
          {node.children.map((item, index) =>
            renderMenuNode({
              node: item,
              key: index,
              theme,
              indent: true,
              drawerOpen,
              expanded,
              menuDispatch,
              setDrawerOpen,
            }),
          )}
        </List>
      </Collapse>
    </React.Fragment>
  );
}

interface Props {
  drawerOpen: boolean;
  setDrawerOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

function Navigation({ drawerOpen, setDrawerOpen }: Props) {
  const theme = useTheme();
  const [expanded, menuDispatch] = useMenuExpand();
  return (
    <React.Fragment>
      <List>
        {navigationConfig.map((item, index) =>
          renderMenuNode({
            node: item,
            key: index,
            theme,
            drawerOpen,
            expanded,
            menuDispatch,
            setDrawerOpen,
          }),
        )}
      </List>
    </React.Fragment>
  );
}

export default Navigation;
