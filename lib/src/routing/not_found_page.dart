import 'package:flutter/material.dart';
import 'package:portfolio/src/common_widgets/empty_placeholder_widget.dart';
import 'package:portfolio/src/localization/l10n.dart';

/// Simple not found screen used for 404 errors (page not found on web)
class NotFoundPage extends StatelessWidget {
  const NotFoundPage({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(),
      body: EmptyPlaceholderWidget(
        message: context.l10n.pageNotFound404,
      ),
    );
  }
}
