import React from 'react';
import { Game } from '../GameList/GameList';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import Grid, { GridSpacing } from '@material-ui/core/Grid';
import FormLabel from '@material-ui/core/FormLabel';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import RadioGroup from '@material-ui/core/RadioGroup';
import Radio from '@material-ui/core/Radio';
import Paper from '@material-ui/core/Paper';
import { Card, Table, TableBody, TableCell, TableContainer, TableFooter, TableHead, TableRow } from '@material-ui/core';

interface GameDetailsProps {
  game?: Game;
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    table: {
      minWidth: 600,
    },
    root: {
      paddingTop: 50,
      flexGrow: 1,
    },
    paper: {
      height: 300,
      width: 600,
    },
    control: {
      padding: theme.spacing(2),
    },
  }),
);

export default function GameDetails(props: GameDetailsProps) {
  const [spacing, setSpacing] = React.useState<GridSpacing>(2);
  const classes = useStyles();
  const { game } = props;

  var match: any[] = [];
  game?.movements.forEach((item, index) => {
    if (index % 2 == 0) {
      match.push(['', '', '', '']);
    }
    var pos = match.length - 1;
    if (index % 2 == 0) {
      match[pos][0] = item.position1;
      match[pos][1] = item.position2;
    } else {
      match[pos][2] = item.position1;
      match[pos][3] = item.position2;
    }
  });

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSpacing(Number((event.target as HTMLInputElement).value) as GridSpacing);
  };

  return (
    <Grid container className={classes.root} spacing={2}>
      <Grid container justifyContent="center" spacing={spacing}>
        <Paper className={classes.paper} elevation={0}>
          <TableContainer component={Card}>
            <Table className={classes.table} size="small" aria-label="a dense table">
              <TableHead>
                <TableRow>
                  <TableCell align="center" colSpan={4}>{game?.strategyName != "" ? game?.strategyName : "-"}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell align="center" colSpan={2}>{game?.whiteName}</TableCell>
                  <TableCell align="center" colSpan={2}>{game?.blackName}</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {match.map((row, index) => (
                  <TableRow key={index}>
                    <TableCell align="right">{row[0]}</TableCell>
                    <TableCell align="left">{row[1]}</TableCell>
                    <TableCell align="right">{row[2]}</TableCell>
                    <TableCell align="left">{row[3]}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
              <TableFooter>
                <TableRow>
                  <TableCell align="center" colSpan={4}>{game?.result}</TableCell>
                </TableRow>
              </TableFooter>
            </Table>
          </TableContainer>
        </Paper>
      </Grid>
    </Grid>
  );
}