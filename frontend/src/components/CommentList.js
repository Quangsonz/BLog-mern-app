import * as React from "react";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import moment from "moment";

const CommentList = ({ name, text, createdAt, avatar }) => {
  return (
    <List sx={{ width: "100%", bgcolor: "background.paper" }}>
      <ListItem alignItems="flex-start" sx={{ p: 0 }}>
        <ListItemAvatar>
          <Avatar 
            src={avatar}
            sx={{ 
              bgcolor: avatar ? 'transparent' : 'primary.main', 
              width: 44, 
              height: 44 
            }}
          >
            {!avatar && (name?.[0]?.toUpperCase() || 'U')}
          </Avatar>
        </ListItemAvatar>
        <ListItemText
          primary={
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                {name}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {createdAt ? moment(createdAt).fromNow() : ''}
              </Typography>
            </Box>
          }
          secondary={
            <>
              <Typography
                sx={{ display: 'block', mt: 0.5 }}
                component="span"
                variant="body2"
                color="text.primary"
              >
                {text}
              </Typography>
            </>
          }
          sx={{ ml: 1 }}
        />
      </ListItem>
    </List>
  );
};

export default CommentList;
