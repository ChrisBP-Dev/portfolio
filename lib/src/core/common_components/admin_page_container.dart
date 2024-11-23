import 'package:flutter/material.dart';
import 'package:portfolio/src/core/common_components/full_page_container.dart';

class AdminPageContainer extends StatelessWidget {
  const AdminPageContainer({
    required this.page,
    super.key,
  });
  final Widget page;

  @override
  Widget build(BuildContext context) {
    return FullPageContainer(page: page, isAdmin: true);
  }
}
